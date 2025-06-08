import { apiRequest } from "./queryClient";
import type { 
  LoginResponse, 
  DashboardData, 
  PoolTable, 
  Transaction, 
  Withdrawal, 
  WithdrawalResponse 
} from "./types";

class PoolTableAPI {
  async login(accountId: string, password: string): Promise<LoginResponse> {
    try {
      const response = await apiRequest("POST", "/login", {
        accountId,
        password
      });
      const data = await response.json();
      console.log('Login response:', data); // Debug log

      // Handle WordPress REST API response format
      if (data.success) {
        return {
          success: true,
          token: data.token,
          user: {
            id: data.user.id,
            name: data.user.name,
            accountNumber: data.user.accountNumber,
            phoneNumber: data.user.phoneNumber
          }
        };
      } else {
        return {
          success: false,
          message: data.message || "Login failed"
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred"
      };
    }
  }

  async getDashboardData(userId: number): Promise<DashboardData> {
    const response = await apiRequest("GET", `/users/${userId}`);
    return response.json();
  }

  async getPoolTables(accountNumber: string): Promise<PoolTable[]> {
    const response = await apiRequest("GET", `/devices?account_no=${accountNumber}`);
    return response.json();
  }

  async getTransactions(accountNumber: string, search?: string, tableId?: string): Promise<Transaction[]> {
    const params = new URLSearchParams({ account_no: accountNumber });
    if (search) params.append("search", search);
    if (tableId) params.append("device_id", tableId);
    
    const response = await apiRequest("GET", `/devices/${tableId}/transactions?${params}`);
    return response.json();
  }

  async getWithdrawals(accountNumber: string): Promise<Withdrawal[]> {
    const response = await apiRequest("GET", `/withdraw?account_no=${accountNumber}`);
    return response.json();
  }

  async createWithdrawal(accountNumber: string, amount: number, password: string): Promise<WithdrawalResponse> {
    const response = await apiRequest("POST", "/withdraw", {
      accountNumber,
      amount,
      password
    });
    return response.json();
  }
}

export const poolTableAPI = new PoolTableAPI();

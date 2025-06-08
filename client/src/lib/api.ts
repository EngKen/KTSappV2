import { apiRequest } from "./queryClient";
import { 
  User, 
  PoolTable, 
  Transaction, 
  Withdrawal, 
  DashboardData, 
  LoginResponse,
  WithdrawalResponse 
} from "./types";

class PoolTableAPI {
  async login(accountId: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login for account:', accountId);
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ accountId, password }),
      });
      
      console.log('Login response:', response);
      
      if (response.success) {
        return {
          success: true,
          token: response.token,
          user: {
            id: response.user.id,
            name: response.user.name,
            accountNumber: response.user.accountNumber,
            phoneNumber: response.user.phoneNumber,
            serialNumber: response.user.serialNumber
          }
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      };
    }
  }

  async getDashboardData(userId: number): Promise<DashboardData> {
    const response = await apiRequest(`/users/${userId}`, {
      method: 'GET',
    });
    return response;
  }

  async getPoolTables(accountNumber: string): Promise<PoolTable[]> {
    const response = await apiRequest(`/devices?account_no=${accountNumber}`, {
      method: 'GET',
    });
    return response;
  }

  async getTransactions(deviceId: number, search?: string): Promise<Transaction[]> {
    const url = search 
      ? `/devices/${deviceId}/transactions?search=${encodeURIComponent(search)}`
      : `/devices/${deviceId}/transactions`;
    const response = await apiRequest(url, {
      method: 'GET',
    });
    return response;
  }

  async getWithdrawals(accountNumber: string): Promise<Withdrawal[]> {
    const response = await apiRequest(`/withdraw?account_no=${accountNumber}`, {
      method: 'GET',
    });
    return response;
  }

  async requestWithdrawal(accountNumber: string, amount: number): Promise<WithdrawalResponse> {
    const response = await apiRequest('/withdraw', {
      method: 'POST',
      body: JSON.stringify({ accountNo: accountNumber, amount }),
    });
    return response;
  }

  async updateDeviceInfo(deviceId: number, data: Partial<PoolTable>): Promise<PoolTable> {
    const response = await apiRequest(`/devices/${deviceId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  }
}

export const api = new PoolTableAPI();

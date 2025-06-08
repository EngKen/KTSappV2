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
    const response = await apiRequest("POST", "/api/auth/login", {
      accountId,
      password
    });
    return response.json();
  }

  async getDashboardData(userId: number): Promise<DashboardData> {
    const response = await apiRequest("GET", `/api/users/${userId}/dashboard`);
    return response.json();
  }

  async getPoolTables(accountNumber: string): Promise<PoolTable[]> {
    const response = await apiRequest("GET", `/api/pool-tables?account=${accountNumber}`);
    return response.json();
  }

  async getTransactions(accountNumber: string, search?: string, tableId?: string): Promise<Transaction[]> {
    const params = new URLSearchParams({ account: accountNumber });
    if (search) params.append("search", search);
    if (tableId) params.append("table", tableId);
    
    const response = await apiRequest("GET", `/api/transactions?${params}`);
    return response.json();
  }

  async getWithdrawals(accountNumber: string): Promise<Withdrawal[]> {
    const response = await apiRequest("GET", `/api/withdrawals?account=${accountNumber}`);
    return response.json();
  }

  async createWithdrawal(accountNumber: string, amount: number): Promise<WithdrawalResponse> {
    const response = await apiRequest("POST", "/api/withdrawals", {
      accountNumber,
      amount
    });
    return response.json();
  }
}

export const poolTableAPI = new PoolTableAPI();

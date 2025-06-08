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
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      console.log('Attempting login for user:', username);
      const response = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      
      console.log('Login response:', response);
      
      if (response.success) {
        return {
          success: true,
          user: response.user,
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      };
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    const response = await apiRequest('/dashboard', {
      method: 'GET',
    });
    return response;
  }

  async getPoolTables(): Promise<PoolTable[]> {
    const response = await apiRequest('/pool-tables', {
      method: 'GET',
    });
    return response;
  }

  async getTransactions(): Promise<Transaction[]> {
    const response = await apiRequest('/transactions', {
      method: 'GET',
    });
    return response;
  }

  async getWithdrawals(): Promise<Withdrawal[]> {
    const response = await apiRequest('/withdrawals', {
      method: 'GET',
    });
    return response;
  }

  async requestWithdrawal(amount: number): Promise<WithdrawalResponse> {
    const response = await apiRequest('/withdrawals', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return response;
  }
}

export const api = new PoolTableAPI();

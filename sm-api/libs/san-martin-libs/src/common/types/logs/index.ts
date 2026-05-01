export interface IErrorLogs {
  [key: string]: {
    url?: string;
    query?: any;
    body?: any;
    headers?: any;
    method?: string;
    exception: { message: string; stack: string };
    responseBody: {
      message: string;
      code?: number;
      details?: any;
      data?: any;
    };
  };
}

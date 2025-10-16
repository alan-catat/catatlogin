declare module "midtrans-client" {
    export class CoreApi {
      constructor(options: {
        isProduction: boolean
        serverKey: string
        clientKey: string
      })
      charge(params: any): Promise<any>
    }
  
    export class Snap {
      constructor(options: {
        isProduction: boolean
        serverKey: string
        clientKey: string
      })
      createTransaction(params: any): Promise<any>
      createTransactionToken(params: any): Promise<string>
    }
  }
  
import { LambdaClient, InvokeCommand } from "@aws-sdk/client-lambda";
import type { InvokeCommandOutput } from "@aws-sdk/client-lambda";

interface Product {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
}

class ProductService {
  private lambda: LambdaClient;

  constructor() {
    this.lambda = new LambdaClient({
      region: "us-east-1",
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  private async invokeLambda<T>(command: InvokeCommand): Promise<T> {
    const response: InvokeCommandOutput = await this.lambda.send(command);
    if (!response.Payload) {
      throw new Error("No payload returned from Lambda.");
    }
    const payloadStr =
      typeof response.Payload === "string"
        ? response.Payload
        : new TextDecoder("utf-8").decode(response.Payload);
    return JSON.parse(payloadStr) as T;
  }

  getProducts(): Promise<any> {
    return this.invokeLambda(
      new InvokeCommand({
        FunctionName: "Read_Product_Prisma",
        InvocationType: "RequestResponse",
      })
    );
  }

  createProduct(product: Product): Promise<any> {
    return this.invokeLambda(
      new InvokeCommand({
        FunctionName: "Create_Product_Prisma",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(product),
      })
    );
  }

  deleteProduct(productID: string): Promise<any> {
    return this.invokeLambda(
      new InvokeCommand({
        FunctionName: "delete_product_prisma",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify({ product_id: productID }),
      })
    );
  }

  updateProduct(product: Partial<Product>): Promise<any> {
    return this.invokeLambda(
      new InvokeCommand({
        FunctionName: "update_product_prisma",
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(product),
      })
    );
  }
}

export default ProductService;

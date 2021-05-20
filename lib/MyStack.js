import * as sst from "@serverless-stack/resources";
import * as lambda from "@aws-cdk/aws-lambda";
import { HttpMethod } from "@aws-cdk/aws-apigatewayv2";


export default class MyStack extends sst.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    
    scope.stage; 
    scope.region; 
    scope.name;

    // Create the HTTP API
    const api = new sst.Api(this, "Api", {
      routes: {
        "GET /": "src/lambda.handler",
      },
      httpApi: {
        disableExecuteApiEndpoint: true,
      },
      cors: {
        allowMethods: [HttpMethod.GET],
      },
      customDomain: "api.domain.com",
    });

    // adds routes
    api.addRoutes(this, {
      "GET    /notes/{id}": "src/get.main",
      "PUT    /notes/{id}": "src/update.main",
      "DELETE /notes/{id}": "src/delete.main",
    });

    // Lazily we could replace the code "Create the HTTP AI" and "adds routes" by:
    // const api = new Api(this, "Api");

    // api.addRoutes(this, {
    //   "GET    /notes": "src/list.main",
    //   "POST   /notes": "src/create.main",
    // });

    // Show API endpoint in output
    this.addOutputs({
      "ApiEndpoint": api.url,
    });

    // Get Chrome Layer
    const layerArn =
    "arn:aws:lambda:eu-west-1:764866452798:layer:chrome-aws-lambda:22";
  
    new sst.Function(this, "Function", {
      handler: "src/lambda.main",
      environment: {
        MY_ENV_VAR: process.env.MY_ENV_VAR,
      },
      bundle: {
        externalModules: ["chrome-aws-lambda"],
      },
      layers: [
        lambda.LayerVersion.fromLayerVersionArn(this, "ChromeLayer", layerArn),
      ],
    });

  }
}

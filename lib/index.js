import MyStack from "./MyStack";

export default function main(app) {
  // Set default runtime for all functions
  app.setDefaultFunctionProps({
    runtime: "nodejs12.x",
    environment: { MY_ENV_VAR: process.env.MY_ENV_VAR },
  });

  new MyStack(app, "my-stack");


  // Add more stacks
  
}

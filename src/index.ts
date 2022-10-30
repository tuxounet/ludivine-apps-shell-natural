import { NaturalInterpreterApp } from "./apps/natural";
import { modules } from "@ludivine/runtime";

const moduleDefinition: modules.IModuleDefinition = {
  applications: [
    {
      name: "shell-natural",
      ctor: (kernel, parent) => new NaturalInterpreterApp(kernel, parent),
    },
  ],
};
export default moduleDefinition;

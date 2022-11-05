import { NaturalInterpreterApp } from "./apps/natural";
import { modules, sessions } from "@ludivine/runtime";

const moduleDefinition: modules.IModuleDefinition = {
  applications: [
    {
      name: "shell-natural",
      ctor: (session: sessions.ISession) => new NaturalInterpreterApp(session),
    },
  ],
};
export default moduleDefinition;

import path from "path";
import {
  bases,
  sessions,
  messaging,
  logging,
  compute,
  storage,
} from "@ludivine/runtime";

export class NaturalInterpreterApp extends bases.AppElement {
  constructor(readonly session: sessions.ISession) {
    super("natural-interpreter", session, ["/channels/input/natural"]);
    this.storage = this.kernel.container.get("storage");
    this.compute = this.kernel.container.get("compute");
  }

  storage: storage.IStorageBroker;
  compute: compute.IComputeBroker;

  @logging.logMethod()
  protected async main(): Promise<number> {
    await this.waitForShutdown();
    return 0;
  }

  @logging.logMethod()
  async onMessage(message: messaging.IMessageEvent): Promise<void> {
    this.log.debug(
      "message arrival",
      message.recipient,
      message.sender,
      message.body
    );
    switch (message.recipient) {
      case "/channels/input/natural":
        await this.session.output(
          "commande natural recu " +
            String(message.body.command) +
            " depuis " +
            String(message.body.channel),
          "message"
        );
        await this.processNaturalCommand(String(message.body.command));
    }
  }

  @logging.logMethod()
  protected async processNaturalCommand(command: string): Promise<void> {
    const scriptsFolder = path.resolve(
      __dirname,
      "..",
      "assets",
      "interpreters"
    );

    const sourceVolume = await this.storage.createEphemeralVolume(
      "local",
      "local",
      { folder: scriptsFolder },
      this
    );

    const helloPythonProject = await this.compute.executeSource(
      "python-local",
      sourceVolume,
      [{ name: "nltk" }],
      "nlp.py",
      [command]
    );

    await this.session.output(
      "interpretation de la commande: " + String(helloPythonProject.output),
      "message"
    );
  }
}

import path from "path";
import { bases, sessions, messaging } from "@ludivine/runtime";

export class NaturalInterpreterApp extends bases.AppElement {
  constructor(readonly session: sessions.ISession) {
    super("natural-interpreter", session);
  }

  protected async onStart(): Promise<void> {
    await this.kernel.messaging.subscribeTopic("/channels/input/natural", this);
  }

  protected async onStop(): Promise<void> {
    await this.kernel.messaging.unsubscribeTopic(
      "/channels/input/natural",
      this.fullName
    );
  }

  protected async main(): Promise<number> {
    await this.waitForShutdown();
    return 0;
  }

  async onMessage(message: messaging.IMessageEvent): Promise<void> {
    this.log.debug(
      "message arrival",
      message.recipient,
      message.sender,
      message.body
    );
    switch (message.recipient) {
      case "/channels/input/natural":
        await this.session.output({
          type: "message",
          body:
            "commande natural recu " +
            String(message.body.command) +
            " depuis " +
            String(message.body.channel),
        });
        await this.processNaturalCommand(String(message.body.command));
    }
  }

  protected async processNaturalCommand(command: string): Promise<void> {
    const scriptsFolder = path.resolve(
      __dirname,
      "..",
      "assets",
      "interpreters"
    );

    const sourceVolume = await this.kernel.storage.createEphemeralVolume(
      "local",
      "local",
      { folder: scriptsFolder },
      this
    );

    const helloPythonProject = await this.kernel.compute.executeSource(
      "python-local",
      sourceVolume,
      [{ name: "nltk" }],
      "nlp.py",
      [command]
    );

    await this.session.output({
      type: "message",
      body: "interpretation de la commande: " + helloPythonProject.output,
    });
  }
}

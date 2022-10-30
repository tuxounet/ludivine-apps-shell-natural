import path from "path";
import { bases, kernel, messaging } from "@ludivine/runtime";

export class NaturalInterpreterApp extends bases.AppElement {
  constructor(
    readonly kernel: kernel.IKernel,
    readonly parent: kernel.IKernelElement
  ) {
    super("natural-interpreter", kernel, parent, ["/channels/input/natural"]);
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
        await this.kernel.channels.broadcast(
          "commande natural recu " +
            message.body.command +
            " depuis " +
            message.body.channel
        );
        await this.processNaturalCommand(message.body.command);
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

    await this.kernel.channels.broadcast(
      "interpretation de la commande: " + helloPythonProject.output
    );
  }
}

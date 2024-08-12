import { InteractionType } from 'discord-api-types/v10'
import { BaseInteraction, CacheType } from 'discord.js'
import * as http from 'http'
import promClient, { Gauge, PrometheusContentType, Counter } from 'prom-client'

class PrometheusClient {
  public registry: promClient.Registry;
  public gateway: promClient.Pushgateway<PrometheusContentType>;
  
  private guildCountGauge: Gauge<string>;
  private userCountGauge: Gauge<string>;
  private formCountGauge: Gauge<string>;
  
  private commandCountGauge: Counter<string>;
  private buttonCountGauge: Counter<string>;
  private modalCountGauge: Counter<string>;
  private selectMenuCountGauge: Counter<string>;
  
  private commandErrorCountGauge: Counter<string>;
  private buttonErrorCountGauge: Counter<string>;
  private modalErrorCountGauge: Counter<string>;
  private selectMenuErrorCountGauge: Counter<string>;
  
  constructor() {
    this.registry = new promClient.Registry();
    
    this.gateway = new promClient.Pushgateway(
      process.env.PROMETHEUS_PUSHGATEWAY!,
      {
        timeout: 5000,
        agent: new http.Agent({
          keepAlive: true,
          keepAliveMsecs: 10000,
          maxSockets: 5,
        }),
      },
      this.registry
    );

    this.guildCountGauge = new Gauge({
      name: 'guilds',
      help: 'The total number of guilds',
      registers: [this.registry],
    });
    
    this.userCountGauge = new Gauge({
      name: 'users',
      help: 'The total number of users',
      registers: [this.registry],
    });
    
    this.formCountGauge = new Gauge({
      name: 'forms',
      help: 'The total number of forms',
      registers: [this.registry],
    });
    
    this.commandCountGauge = new Counter({
      name: 'command_interactions',
      help: 'The total number of command interactions',
      registers: [this.registry],
    });
    
    this.buttonCountGauge = new Counter({
      name: 'button_interactions',
      help: 'The total number of button interactions',
      registers: [this.registry],
    });
    
    this.modalCountGauge = new Counter({
      name: 'modal_interactions',
      help: 'The total number of modal interactions',
      registers: [this.registry],
    });
    
    this.selectMenuCountGauge = new Counter({
      name: 'select_menu_interactions',
      help: 'The total number of select menu interactions',
      registers: [this.registry],
    });
    
    this.commandErrorCountGauge = new Counter({
      name: 'error_command_interactions',
      help: 'The total number of command interactions',
      registers: [this.registry],
    });
    
    this.buttonErrorCountGauge = new Counter({
      name: 'error_button_interactions',
      help: 'The total number of button interactions',
      registers: [this.registry],
    });
    
    this.modalErrorCountGauge = new Counter({
      name: 'error_modal_interactions',
      help: 'The total number of modal interactions',
      registers: [this.registry],
    });
    
    this.selectMenuErrorCountGauge = new Counter({
      name: 'error_select_menu_interactions',
      help: 'The total number of select menu interactions',
      registers: [this.registry],
    });
  }

  public async pushGuildCount(guildCount: number) {
    this.guildCountGauge.set(guildCount);
    await this.pushMetrics();
  }
  
  public async pushUserCount(userCount: number) {
    this.userCountGauge.set(userCount);
    await this.pushMetrics();
  }
  
  public async pushFormCount(formCount: number) {
    this.formCountGauge.set(formCount);
    await this.pushMetrics();
  }

  public async incrementInteraction(interaction: BaseInteraction<CacheType>) {
    switch (interaction.type){
      case InteractionType.ModalSubmit:
          this.modalCountGauge.inc();
          await this.pushMetrics();
        break
      case InteractionType.ApplicationCommand:
          this.commandCountGauge.inc();
          await this.pushMetrics();
        break
      case InteractionType.MessageComponent:
          if(interaction.isButton()){
            this.buttonCountGauge.inc();
            await this.pushMetrics();
          }
          if(interaction.isStringSelectMenu()){
            this.selectMenuCountGauge.inc();
            await this.pushMetrics();
          }
        break
    }
  }
  
  public async incrementErrorInteraction(interaction: BaseInteraction<CacheType>) {
    switch (interaction.type){
      case InteractionType.ModalSubmit:
        this.modalErrorCountGauge.inc();
        await this.pushMetrics();
        break
      case InteractionType.ApplicationCommand:
        this.commandErrorCountGauge.inc();
        await this.pushMetrics();
        break
      case InteractionType.MessageComponent:
        if(interaction.isButton()){
          this.buttonErrorCountGauge.inc();
          await this.pushMetrics();
        }
        if(interaction.isStringSelectMenu()){
          this.selectMenuErrorCountGauge.inc();
          await this.pushMetrics();
        }
        break
    }
  }

  private async pushMetrics() {
    try {
      await this.gateway.pushAdd({
        jobName: 'stats',
      });
      console.log('Metrics pushed successfully');
    } catch (err) {
      console.error('Failed to push metrics:', err);
    }
  }
}

export { PrometheusClient };

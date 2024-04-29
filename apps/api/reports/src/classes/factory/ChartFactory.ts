import { MessageStatsStrategy } from "@strategies/MessageStatsStratergy";
import { IChartStrategy } from "@interfaces/IChartStratergy";
import { SuccessVersusFailedStratergy } from "@strategies/SuccessVersusFailedStratergy";
import { MessagePerformanceStategy } from "@strategies/MessagePerformanceStategy";
import { MessageStatusStrategy } from "@strategies/MessageStatusStrategy";
import { SubscriberOptInStrategy } from "@strategies/SubscriberOptInStrategy";
import { NotificationCategoryStrategy } from "@strategies/NotificationCategoryStrategy";
import { FailedReasonStrategy } from "@strategies/FailedReasonStrategy";
import { CampaignPerformanceStrategy } from "@strategies/CampaignPerformanceStrategy";

export class ChartFactory {
  private strategies: { [key: string]: IChartStrategy } = {
    messageStatus: new MessageStatusStrategy(),
    successFailed: new SuccessVersusFailedStratergy(),
    messageStats: new MessageStatsStrategy(),
    messagePerformance: new MessagePerformanceStategy(),
    subscriberOptInStatus: new SubscriberOptInStrategy(),
    notificationCategory: new NotificationCategoryStrategy(),
    failedReason: new FailedReasonStrategy(),
    campaignPerformance: new CampaignPerformanceStrategy(),
  };

  getStrategy(strategyKey: string): IChartStrategy {
    const strategy = this.strategies[strategyKey];
    if (!strategy) {
      throw new Error(`Strategy for chart ${strategyKey} not found`);
    }
    return strategy;
  }
}

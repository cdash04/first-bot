import { Model } from 'dynamodb-onetable';

import { Broadcaster } from '../repository/schema';

export class BroadcasterService {
  private readonly broadcaster: Promise<Broadcaster>;

  broadcasterIsNew: boolean;

  constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly broadcasterRepository: Model<Broadcaster>,
  ) {
    this.broadcaster = this.broadcasterRepository
      .get({ id })
      .then((broadcaster) => {
        if (!broadcaster) {
          this.broadcasterIsNew = true;
          return this.initBroadcaster();
        }
        return broadcaster;
      });
  }

  private async initBroadcaster() {
    return this.broadcasterRepository.create({
      id: this.id,
      name: this.name,
      online: false,
      firstIsRedeemed: false,
      currentFirstStreak: 0,
      bits: 0,
    });
  }

  async broadcasterIsOnline(): Promise<boolean> {
    return (await this.broadcaster).online;
  }

  async firstIsRedeemed(): Promise<boolean> {
    return (await this.broadcaster).firstIsRedeemed;
  }

  async viewerIsAlreadyFirst(viewerId: string): Promise<boolean> {
    return (await this.broadcaster).currentFirstViewer === viewerId;
  }

  async viewerIsNotAlreadyFirst(viewerId: string): Promise<boolean> {
    return (await this.broadcaster).currentFirstViewer !== viewerId;
  }

  async setNewStreak(viewerId: string): Promise<Broadcaster> {
    return this.broadcasterRepository.update(
      { id: this.id },
      {
        set: {
          name: this.name,
          currentFirstViewer: viewerId,
          currentFirstStreak: 1,
          firstIsRedeemed: true,
        },
      },
    );
  }

  async updateCurrentStreak(): Promise<Broadcaster> {
    return this.broadcasterRepository.update(
      { id: this.id },
      {
        add: { currentFirstStreak: 1 },
        set: { name: this.name, firstIsRedeemed: true },
      },
    );
  }
}

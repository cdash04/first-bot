import { Model } from 'dynamodb-onetable';
import { BroadcasterType } from '../repository/schema';

type UpdateBroadcasterInput = Omit<BroadcasterType, 'pk' | 'sk'> &
  Required<Pick<BroadcasterType, 'name'>>;

export const getBroadcasterService = (
  broadcasterRepository: Model<BroadcasterType>,
) => {
  const initBroadcaster = (
    broadcasterName: string,
    viewerName: string,
  ): Promise<BroadcasterType> => {
    return broadcasterRepository.create({
      name: broadcasterName,
      currentFirstViewer: viewerName,
      currentFirstStreak: 1,
      firstIsRedeemed: true,
    });
  };

  const updateBroadcaster = ({
    name,
    ...broadcaster
  }: UpdateBroadcasterInput): Promise<BroadcasterType> => {
    return broadcasterRepository.update({ name }, { set: broadcaster });
  };

  return {
    initBroadcaster,
    updateBroadcaster,
  };
};

import { ApplicationError } from '@/protocols';

export function roomWithourCapacity(): ApplicationError {
  return {
    name: 'RoomWithoutCapacity',
    message: 'There is no capacity for this room',
  };
}

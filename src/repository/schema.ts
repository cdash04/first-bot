/* eslint-disable no-template-curly-in-string */
import { Entity } from 'dynamodb-onetable';

const Broadcaster = {
  pk: { type: String, value: 'broadcaster:${name}' },
  sk: { type: String, value: 'broadcaster:' },
  id: { type: String, required: true },
  name: { type: String, required: true },
  online: { type: Boolean, value: false },
  firstIsRedeemed: { type: Boolean, value: false },
  currentFirstViewer: { type: String },
};

const Viewer = {
  pk: { type: String, value: 'broadcaster:${broadcasterName}' },
  sk: { type: String, value: 'viewer:${name}' },
  id: { type: String, required: true },
  broadcasterName: { type: String, required: true },
  name: { type: String, required: true },
  firstStreak: { type: Number, value: '0' },
};

export const Schema = {
  format: 'onetable:1.1.0',
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    gs1: { hash: 'gs1pk', sort: 'gs1sk', follow: true },
    ls1: { sort: 'id', type: 'local' },
  },
  models: {
    Broadcaster,
    Viewer,
  },
  params: {
    isoDates: true,
    timestamps: true,
  },
};

export type BroadcasterType = Entity<typeof Schema.models.Broadcaster>;
export type ViewerType = Entity<typeof Schema.models.Viewer>;

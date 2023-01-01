/* eslint-disable no-template-curly-in-string */
import { Entity } from 'dynamodb-onetable';

const broadcaster = {
  pk: { type: String, value: 'broadcaster:${id}' },
  sk: { type: String, value: 'broadcaster:' },
  id: { type: String, required: true },
  name: { type: String, required: true },
  online: { type: Boolean },
  firstIsRedeemed: { type: Boolean },
  currentFirstViewer: { type: String },
  currentFirstStreak: { type: Number },
  payToWinIsEnabled: { type: Boolean },
  bits: { type: Number },
};

const viewer = {
  pk: { type: String, value: 'viewer:${broadcasterId}' },
  sk: { type: String, value: 'viewer:${id}' },
  id: { type: String, required: true },
  name: { type: String, required: true },
  broadcasterId: { type: String, required: true },
  broadcasterName: { type: String, required: true },
  firstCount: { type: Number },
};

export const Schema = {
  format: 'onetable:1.1.0',
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    ls1: { sort: 'name', type: 'local' },
  },
  models: {
    Broadcaster: broadcaster,
    Viewer: viewer,
  },
  params: {
    isoDates: true,
    timestamps: true,
  },
};

export type Broadcaster = Entity<typeof Schema.models.Broadcaster>;
export type Viewer = Entity<typeof Schema.models.Viewer>;

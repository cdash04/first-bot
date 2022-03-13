/* eslint-disable no-template-curly-in-string */
import { Entity } from 'dynamodb-onetable';

const Broadcaster = {
  pk: { type: String, value: 'broadcaster:${name}' },
  sk: { type: String, value: 'broadcaster:' },
  name: { type: String, required: true },
  online: { type: Boolean, value: false },
  firstIsRedeemed: { type: Boolean, value: false },
  currentFirstViewer: { type: String },
};

const Viewer = {
  pk: { type: String, value: 'viewer:${name}' },
  sk: { type: String, value: 'broadcaster:${broadcasterName}' },
  name: { type: String, required: true },
  broadcasterName: { type: String, required: true },
  firstStreak: { type: Number, value: '0' },
};

export const Schema = {
  format: 'onetable:1.1.0',
  version: '0.0.1',
  indexes: {
    primary: { hash: 'pk', sort: 'sk' },
    ls1: { sort: 'name', type: 'local' },
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

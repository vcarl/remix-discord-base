import type { Guild as DiscordGuild, Role, TextChannel } from "discord.js";
import knex from "~/db.server";

type jsonString = string;
export interface Guild {
  id: string;
  channels: jsonString;
  roles: jsonString;
}

export enum CHANNELS {
  modLog = "modLog",
}
export enum ROLES {
  moderator = "moderator",
}

export const fetchGuild = async (guild: DiscordGuild) => {
  return await knex<Guild>("guilds")
    .select("*")
    .where({ id: guild.id })
    .first();
};

export const fetchChannel = async (channel: CHANNELS, guild: DiscordGuild) => {
  const id = await knex("guilds")
    .jsonExtract("channels", `$.${channel}`)
    .where({ id: guild.id })
    .first();

  return (await guild.channels.fetch(id)) as TextChannel;
};

export const fetchRole = async (role: ROLES, guild: DiscordGuild) => {
  const id = await knex("guilds")
    .jsonExtract("roles", `$.${role}`)
    .where({ id: guild.id })
    .first();

  return (await guild.roles.fetch(id)) as Role;
};

export const registerChannel = async (
  channel: CHANNELS,
  channelId: string,
  guild: DiscordGuild,
) => {
  return await knex("guilds")
    .jsonSet("channels", `$.${channel}`, channelId)
    .where({ id: guild.id });
};

export const registerRole = async (
  role: ROLES,
  roleId: string,
  guild: DiscordGuild,
) => {
  return await knex("guilds")
    .jsonSet("roles", `$.${role}`, roleId)
    .where({ id: guild.id });
};

import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
// import SampleObjectDatastore from "../datastores/sample_datastore.ts";

export const GetChannelMembersFunctionDefinition = DefineFunction({
  callback_id: "get_channel_members_function",
  title: "Get Channel Members",
  description: "Get all members of a single channel",
  source_file: "functions/get_channel_members.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
        description: "Channel to fetch members from",
      },
    },
    required: ["channel"],
  },
  output_parameters: {
    properties: {
      member_ids: {
        type: Schema.types.string,
        description: "A list of members",
        title: "Member IDs",
      },
    },
    required: ["member_ids"],
  },
});

export default SlackFunction(
  GetChannelMembersFunctionDefinition,
  async ({ inputs, client }) => {
    const user_ids = await client.conversations.members({
      channel: inputs.channel,
    });

    if (!user_ids.ok) {
      console.log("error", user_ids.error);
      return {
        error:
          `Failed to fetch members of channel: ${inputs.channel} | ${user_ids.error}`,
      };
    }

    // need to add pagination handling here!
    console.log(user_ids.members);

    return {
      outputs: { member_ids: user_ids.members.join(",") },
    };
  },
);

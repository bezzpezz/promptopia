import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (request, {params}) => {
    try {
        await connectToDB();

        const prompts = await Prompt.find({
            creator: params.id
        })
            .populate("creator");

        console.log("returning posts: ", prompts);

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("failed to fetch all prompts!", { status: 500 })
    }
}
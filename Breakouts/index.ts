import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const groups = [
        ["Tom P", "Tom S"],
        ["Tom Z", "Rafael"],
    ]

    context.res = {
        status: 200,
        body: { groups },
    };
};

export default httpTrigger;
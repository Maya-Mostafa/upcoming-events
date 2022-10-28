/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { WebPartContext } from '@microsoft/sp-webpart-base';
import {SPHttpClient} from "@microsoft/sp-http";


export const getEvents = async (context: WebPartContext) => {
    let events = [] ;

    const responseUrl = `https://pdsb1.sharepoint.com/sites/PLCalendar/_api/web/lists/getByTitle('Events')/items`;

    const response = await context.spHttpClient.get(responseUrl, SPHttpClient.configurations.v1);

    if (response.ok){
        const results = await response.json();
        return results.value;
    }



};
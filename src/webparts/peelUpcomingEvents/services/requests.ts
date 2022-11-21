import { WebPartContext } from '@microsoft/sp-webpart-base';
import {MSGraphClientV3} from "@microsoft/sp-http";
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/items/get-all";
import {parseRecurrentEvent, recurrentText} from './recurrentEventOps';

export const getGraphMemberOf = async (context: WebPartContext) : Promise <string> =>{
    const graphUrl = '/me/transitiveMemberOf/microsoft.graph.group';
    //let graphUrl = '/me/memberof';

    return new Promise <string> ((resolve, reject)=>{
        context.msGraphClientFactory
        .getClient('3')
        .then((client: MSGraphClientV3)=>{
            client
                .api(graphUrl)
                .header('ConsistencyLevel', 'eventual')
                .count(true)
                // .select('displayName')
                .top(500)
                .get((error, response: any, rawResponse?: any)=>{
                    console.log("graph response", response);
                    resolve(response);
                });
        });
    });
};

export const isFromTargetAudience = (graphResponse: any, wpTargetAudience: any) => {
    const userGroups = [];
    for (const group of graphResponse){
        userGroups[group.displayName] = group.displayName;
    }
    for (const audience of wpTargetAudience){
        if (userGroups[audience.fullName])
            return true;
    }
    return false;
};

const getLastDayOfWeek = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const last = first + 6;
    const sunday = new Date(today.setDate(last));
    return sunday;
};
const getLastDayOfNextTwoWeeks = () => {
    const today = new Date();
    const first = today.getDate() - today.getDay() + 1;
    const last = first + 20;
    const sunday = new Date(today.setDate(last));
    return sunday;
};
const getLastDayOfMonth = () => {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    const lastDay = new Date(year, month+1, 1);
    return lastDay;
};
const getLastDayofQuarter = () => {
    const currentMonth = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    let currentQ = 1; 
    if (currentMonth > 4 && currentMonth <9) currentQ = 2;
    if (currentMonth > 8) currentQ = 3;
    const lastDayOfQuarter = new Date(year, currentQ*4, 1)
    return lastDayOfQuarter;
};

const getRangeFilter = (dateRange: string) : string => {
    let filterRange : string;

    switch (dateRange){ 
        case 'all':
            filterRange = '';
            break;
        case 'thisWeek':
            filterRange = `and EventDate le '${getLastDayOfWeek().toISOString()}'`;
            break;
        case 'nextTwoWeeks':
            filterRange = `and EventDate le '${getLastDayOfNextTwoWeeks().toISOString()}'`;
            break;
        case 'thisMonth':
            filterRange = `and EventDate le '${getLastDayOfMonth().toISOString()}'`;
            break;
        case 'thisQuarter':
            filterRange = `and EventDate le '${getLastDayofQuarter().toISOString()}'`;
            break;
        default:
            filterRange = '';
            break;
    }
    return filterRange;
};

export const getEvents = async (context: WebPartContext, siteUrl: string, listName: string, dateRange: string, numEvents: number) : Promise <any>  => {
    
    const today = new Date().toISOString();

    const sp = spfi(siteUrl).using(SPFx(context));
    const items : any  = await sp.web.lists.getByTitle(listName).items
        .orderBy('EventDate', true)
        .top(numEvents)
        .select('Id, Title, Category, Created, Description, EventDate, EndDate, Location, Modified, fRecurrence, fAllDayEvent, RecurrenceData, OData__ModernAudienceTargetUserFieldId')
        .filter(`(EventDate ge '${today}' or (EventDate le '${today}' and EndDate ge '${today}')) ${getRangeFilter(dateRange)}`)();

        return items.map(item => {
        return {
            id: item.Id,
            title: item.Title,
            category: item.Category ? item.Category.join(', ') : '',
            created: item.Created,
            description: item.Description,
            startDate: item.EventDate,
            endDate: item.EndDate,
            location: item.Location,
            modified: item.Modified,
            link: `${siteUrl}/Lists/${listName}/DispForm.aspx?ID=${item.Id}`,
            targetAudienceId: item.OData__ModernAudienceTargetUserFieldId,
            isRecurrent: item.fRecurrence,
            recurrenceData: item.RecurrenceData,
            recurrenceObj: item.RecurrenceData ? parseRecurrentEvent(item.RecurrenceData, item.EventDate, item.EndDate): null,
            recurrenceText: item.RecurrenceData ? recurrentText(parseRecurrentEvent(item.RecurrenceData, item.EventDate, item.EndDate)): null,
            //recurrenceText: null,
            fullDay: item.fAllDayEvent,
        }
    });
};



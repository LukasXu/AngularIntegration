import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'DisplayDocWebPartStrings';
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from '@microsoft/sp-http';


import '../../../../displayList/dist/display-list/main';
import '../../../../displayList/dist/display-list/polyfills';
import '../../../../displayList/dist/display-list/runtime';
import '../../../../displayList/dist/display-list/scripts';
//require('../../../../displayList/dist/display-list/styles.css') ;


//import '@webcomponents/custom-elements/src/native-shim';
//import '../displayDoc/app/displayDoc.js';

export interface SPList {
  value: SPListItem[];
}

export interface SPListItem {
  Title: string
}

export interface IDisplayDocWebPartProps {
  listName: string;
}

export default class DisplayDocWebPart extends BaseClientSideWebPart<IDisplayDocWebPartProps> {

  public render(): void {
    /*this.domElement.innerHTML = `
    <div class="${styles.displayDoc}">
      <div id="listContainer">
      </div>
    </div>`;
    this.renderList();*/
    this.domElement.innerHTML = `<app-angular-spfx></app-angular-spfx>`;

  }

  private getListData(): Promise<SPList> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + 
      "/_api/web/lists/GetByTitle('TestList')/Items",
      SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      }).catch(() => {
        console.log('List Data MISTAKE');
      });
  }


  private renderList(): void {
    this.getListData().then((response) => {
      let html: string = '<h3>List Elements</h3>';
      response.value.forEach((item: SPListItem) => {
        html += `
        <h4>${item.Title}</h4>
        `;
      });
      const listContainer: Element = this.domElement.querySelector('#listContainer');
      listContainer.innerHTML = html;
    }).catch(() => {
      console.log('List MISTAKE');
    })
  }

  private addList(): void {
    const spOpts: ISPHttpClientOptions = {
      body: `{ Title: 'Developer Workbench', BaseTemplate: 100 }`
    };

    this.context.spHttpClient.post(this.context.pageContext.web.absoluteUrl + "/_api/web/lists", 
    SPHttpClient.configurations.v1, spOpts)
    .then((response: SPHttpClientResponse) => {
      // Access properties of the response object. 
      console.log(`Status code: ${response.status}`);
      console.log(`Status text: ${response.statusText}`);

      //response.json() returns a promise so you get access to the json in the resolve callback.
      response.json().then((responseJSON: JSON) => {
        console.log(responseJSON);
      });
    }).catch((response) =>{

    })
  }

  private _getEnvironmentMessage(): string {
    if (!!this.context.sdks.microsoftTeams) { // running in Teams
      return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
    }

    return this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}
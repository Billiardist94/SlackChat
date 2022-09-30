import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import * as strings from 'SlackChatWebPartWebPartStrings';
import SlackChatWebPart from './components/SlackChatWebPart';
import { ISlackChatWebPartProps } from './components/ISlackChatWebPartProps';
import { AnyMiddlewareArgs } from '@slack/bolt';

export interface ISlackChatWebPartWebPartProps {
  clientID: string;
  channelID: string;
  socket: AnyMiddlewareArgs;
  dataTime: string;
  messages: Array<Type>;
  // channel: string;
  onChange: any;
}

interface Type {
  user: string,
  text: string,
  ts: string,
  socketID: string,
  userPhoto: string
}

export default class SlackChatWebPartWebPart extends BaseClientSideWebPart<ISlackChatWebPartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISlackChatWebPartProps> = React.createElement(
      SlackChatWebPart,
      {
        clientID: this.properties.clientID,
        channelID: this.properties.channelID,
        userDisplayName: this.context.pageContext.user.displayName,
        userEmail: this.context.pageContext.user.email,
        socket: this.properties.socket,
        dataTime: this.properties.dataTime,
        messages: this.properties.messages,
        // channel: this.properties.channel,
        onChange: this.properties.onChange
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('clientID', {
                  label: 'Client ID'
                }),
                PropertyPaneTextField('channelID', {
                  label: 'Channel ID'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}

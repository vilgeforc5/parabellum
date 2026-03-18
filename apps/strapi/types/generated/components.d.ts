import type { Schema, Struct } from '@strapi/strapi';

export interface SharedSourceLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_source_links';
  info: {
    displayName: 'Source Link';
  };
  attributes: {
    url: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.source-link': SharedSourceLink;
    }
  }
}

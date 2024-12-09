import { defineAPI } from '@aws-amplify/backend';
import { Function } from 'aws-cdk-lib/aws-lambda';

export const api = defineAPI('OpportunityApi', {
  authorization: {
    type: 'userPool',
  },
  routes: {
    '/opportunities': {
      GET: {
        function: Function.fromFunctionArn(
          this,
          'OpportunityFunction',
          process.env.OPPORTUNITY_FUNCTION_ARN
        ),
        authorization: {
          type: 'userPool',
        },
      },
      POST: {
        function: Function.fromFunctionArn(
          this,
          'OpportunitySearchFunction',
          process.env.OPPORTUNITY_FUNCTION_ARN
        ),
        authorization: {
          type: 'userPool',
        },
      },
    },
  },
});
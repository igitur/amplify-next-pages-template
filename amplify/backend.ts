import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { Aspects, CfnResource, Stack } from 'aws-cdk-lib';
import { IConstruct } from 'constructs';

const backend = defineBackend({
  auth,
  data,
});

const rootScope = Stack.of(backend.auth.resources.userPool).node.scope

if (rootScope) {
  Aspects.of(rootScope).add({
    visit(node: IConstruct) {
      if (
          CfnResource.isCfnResource(node) &&
          (node.cfnResourceType == 'AWS::IAM::Role' || node.cfnResourceType == 'AWS::IAM::User')
      ) {
        node.addPropertyOverride('PermissionsBoundary', 'permission-boundary');
      }
    },
  });
}
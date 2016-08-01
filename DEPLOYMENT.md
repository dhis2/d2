![alt text](https://a.slack-edge.com/7bf4/img/services/travis_128.png "Travis")

## Automagic builds and deployments

Builds are automagically published to npm when a pull request is merged into a release branch or when pushed to directly.

The release branches that are build by travis are currently the following:
- v24

## What happens exactly?
- When pushed to v24 or a pull request is merged
- Travis goes through the normal CI stuff
- When this passes it'll do the following deployment steps
    - Update the npm `patch` version
    - Run the build script specified in the `package.json`
    - Push the newly created tag to github



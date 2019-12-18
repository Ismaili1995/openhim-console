# OpenHIM Administration Console

[![Build Status](https://travis-ci.org/jembi/openhim-console.svg?branch=master)](https://travis-ci.org/jembi/openhim-console) [![OpenHIM Core](https://img.shields.io/badge/openhim--core-3.4.x-brightgreen.svg)](http://openhim.readthedocs.org/en/v3.4.2/user-guide/versioning.html)

This application provides a web application to configure and manage the [OpenHIM-core component](https://github.com/jembi/openhim-core-js). It provides the following features:

* Configure and manage OpenHIM channels
* View logged transactions
* Configure clients that can access particular routes
* Monitor the operations of the OpenHIM application
* Managing the security infrastructure
* Importing and exporting OpenHIM server configuration

See the [development road-map](https://jembiprojects.jira.com/wiki/spaces/OHI/pages/edit-v2/679575553) for more details on what is to come!

See documentation and tutorials at [openhim.org](http://openhim.org).

---

## Getting started with the OpenHIM Console

First ensure that you have the OpenHIM-core server up and running. The console communicates with the OpenHIM-core via its API to pull and display data. See [details on how to get the OpenHIM-core setup](https://github.com/jembi/openhim-core-js/blob/master/README.md).

Next, you need to pull down the latest release of the web app and deploy it to a web server (replace the X's in the below command to the latest release):

``` bash
wget https://github.com/jembi/openhim-console/releases/download/vX.X.X/openhim-console-vX.X.X.tar.gz
tar -vxzf openhim-console-vX.X.X.tar.gz --directory /var/www/
```

Next, and this step is _vital_, you need to configure the console to point to your OpenHIM-core server. Locate `config/default.js` in the folder you extracted the OpenHIM console to and edit it as follows:

``` json
{
  "protocol": "https",
  "host": "localhost", // change this to the hostname for your OpenHIM-core server (This hostname _MUST_ be publicly accessible)
  "port": 8080, // change this to the API port of the OpenHIM-core server, default is 8080
  "title": "OpenHIM Admin Console", // You may change this to customize the title of the OpenHIM-console instance
  "footerTitle": "OpenHIM Administration Console", // You may change this to customize the footer of the OpenHIM-console instance
  "footerPoweredBy": "<a href='http://openhim.org/' target='_blank'>Powered by OpenHIM</a>",
  "loginBanner": "" // add text here that you want to appear on the login screen, if any.
}
```

Now, navigate to your web server and you should see the OpenHIM-console load (eg. `http://localhost/`) and login. The default username and password are:

* username: `root@openhim.org`
* password: `openhim-password`

You will be prompted to change this.

> **Note:** You will have problems logging in if your OpenHIM server is still setup to use a self-signed certificate (the default). To get around this you can use the following workaround (the proper way to solve this is to upload a proper certificate into the OpenHIM-core):

Visit the following link: `https://localhost:8080/authenticate/root@openhim.org` in Chrome. Make sure you are visiting this link from the system that is running the OpenHIM-core. Otherwise, replace `localhost` and `8080` with the appropriate OpenHIM-core server hostname and API port. You should see a message saying "**Your connection is not private**". Click "Advanced" and then click "Proceed". Once you have done this, you should see some JSON, you can ignore this and close the page. Ths will ignore the fact that the certificate is self-signed. Now, you should be able to go back to the Console login page and login. This problem will occur every now and then until you load a properly signed certificate into the OpenHIM-core server.

### Docker

If you are familiar with using Docker and Docker Compose, we have included a `docker-compose.yml` file in the `infrastructure` folder.

To spin up a full OpenHIM environment, navigate to the `infrastructure` folder and execute: `docker-compose up`

The console will be available on: `http://localhost:9090`

Remember to accept the self-signed certificate from the back-end for first login: `https://localhost:9095/authenticate/root@openhim.org`

---

## Developer guide

To run this version of the console (v1.12.0-rc.1) requires a minimum version of [OpenHIM-Core v4.0.0-rc.5](https://github.com/jembi/openhim-core-js/releases/tag/v4.0.0-rc.5)

Clone the repository and then run `npm install`

Install cli tools: `npm install -g grunt-cli grunt bower`

Install bower web components: `bower install`

To run the unit tests run `grunt test`

To start up a development instance of the webapp run `grunt serve`. The hostname and port can be changed in `Gruntfile.js`. The hostname can be changed to `0.0.0.0` in order to access the site from outside.

Note all changes will be automatically applied to the web-app and the page will be reloaded after each change. In addition JSHint will be run to provide information about errors or bad code style. The unit tests will also be automatically be run if JSHint does not find any errors.

For unit testing we are using [mocha](http://mochajs.org/) with [chai.js](http://chaijs.com/api/bdd/) for assertions. We are using the BDD `should` style for chai as it more closely resembles the unit testing style that is being used for the [OpenHIM-core component](https://github.com/jembi/openhim-core-js)

This code was scaffolded using [Yeoman](http://yeoman.io/) and the [angular generator](https://github.com/yeoman/generator-angular). You can find more details about the command available by looking at the docs of those tools.

---

## Deployments

All commits to the `master` branch will automatically trigger a build of the latest changes into a docker image on dockerhub.

All commits directly to `staging` or `test` will automatically build and deploy a docker image to the test and staging servers respectively.

---

## Creating CentOS RPM package

The build process for the RPM package is based off [this blog](https://github.com/bbc/speculate/wiki/Packaging-a-Node.js-project-as-an-RPM-for-CentOS-7). The reason for using vagrant instead of docker is so that we can test the RPM package by running it as a service using SystemCtl - similar to how it will likely be used in a production environment. SystemCtl is not available out the box in docker containers.

Refer to [this blog](https://developers.redhat.com/blog/2014/05/05/running-systemd-within-docker-container/) for a more detailed description of a possible work-around. This is not recommended since it is a hack. This is where vagrant comes in since it sets up an isolated VM.

1. Setup environment

    Navigate to the infrastructure folder: `infrastructure/centos`

    Provision VM and automatically build RPM package:

    ```bash
    vagrant up
    ```

    or without automatic provisioning (useful if you prefer manual control of the process):

    ```bash
    vagrant up --no-provision
    ```

1. [Optional] The Vagrant file provisions the VM with the latest source code from master and attempts to compile the RPM package for you. However in the event an error occurs, or if you prefer to have manual control over the process, then you'll need to do the following:

    * Remote into the VM: `vagrant ssh`
    * Download or sync all source code into VM.
    * Ensure all dependencies are installed.

    ```bash
    npm i && npm i speculate
    ```

    * Run speculate to generate the SPEC files needed to build the RPM package.

    ```bash
    npm run spec
    ```

    * Ensure the directory with the source code is linked to the rpmbuild directory - the     folder RPMBUILD will use.

    ```bash
    ln -s ~/openhim-console ~/rpmbuild
    ```

    * Build RPM package.

    ```bash
    rpmbuild -bb ~/rpmbuild/SPECS/openhim-console.spec
    ```

1. Install & Test package

    ```bash
    sudo yum install -y ~/rpmbuild/RPMS/x86_64/openhim-console-{current_version}.x86_64.rpm
    sudo systemctl start openhim-console
    curl http://localhost:9000
    ```

    Note: In order for openhim-console to run successfully, you'll need to point it to a    valid instance of Openhim-core or install it locally:

1. How to check the logs?

    ```bash
    sudo systemctl status openhim-console
    sudo tail -f -n 100 /var/log/messages
    ```

1. If everything checks out then extract the RPM package by leaving the VM.

    Install Vagrant scp [plugin](https://github.com/invernizzi/vagrant-scp):

    ```bash
    vagrant plugin install vagrant-scp
    ```

    Then copy the file from the VM:

    ```bash
    vagrant scp default:/home/vagrant/rpmbuild/RPMS/x86_64/{filename}.rpm .
    ```

---

## Contributing

You may view/add issues here: <https://github.com/jembi/openhim-console/issues>

To contribute code, please fork the repository and submit a pull request. The maintainers will review the code and merge it in if all is well.

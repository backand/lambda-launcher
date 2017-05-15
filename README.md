# Lambda launcher

# Setup project
- Clone Repo
- npm install or sudo install
- bower install

# Setup Env configurations
- `.env.example` contains all enteries to be used.
- Create a copy of `.env.example` and rename it to `.env`
- Update configuration for your ENV.
- If new config entery has to be added, then add that entry to `.env.example` and push to github
- do not push `.env` to github

@TODO 
- Create `.env` file dynamically with default values
- Add build param[--prod | --dev | --staging etc] for any `ENV`;

# Gulp commands
- gulp serve (Launch Application)
- gulp build (Generate production ready code)
- gulp serve:dist (Launch production ready code before deployment on production)

# Deploy Project
- run command before sync backand - One time Installationd
`sudo npm install -g backand`
- backand sync --app ng1app --master master_token --user user_tocken --folder ./dist

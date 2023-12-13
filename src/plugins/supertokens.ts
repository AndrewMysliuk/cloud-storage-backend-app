import supertokens from "supertokens-node"
import Session from "supertokens-node/recipe/session"
import EmailPassword from "supertokens-node/recipe/emailpassword"
import Dashboard from "supertokens-node/recipe/dashboard"

supertokens.init({
  framework: "express",
  supertokens: {
    connectionURI: "http://localhost:3567",
    apiKey: "test-api-key-for-my-cloud-storage",
  },
  appInfo: {
    appName: "cloud-storage",
    apiDomain: "http://localhost:3001",
    websiteDomain: "http://localhost:3000",
    apiBasePath: "/api",
    websiteBasePath: "/",
  },
  recipeList: [EmailPassword.init(), Session.init(), Dashboard.init()],
})

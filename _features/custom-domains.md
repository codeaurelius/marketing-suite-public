This feature is about using vercel's API programatically to manage domains for each tenant.

Overview of the Process

1.	User Adds Their Domain in the UI (the DomainManagement component) and saves it in the database in pending state
2.	Programmatically Add the Domain to our Vercel Project
	- Use the Vercel REST API to add the domain to your project.
	- This step makes Vercel aware of the domain and sets up the necessary configurations.
    - Will use 7f7xMYLz2OnR70VeuItHffUL as vercel api token.
    - create an api endpoint in current repo inside the "apps/api" folder
3.	Generate DNS Configuration for the Client
	- After adding the domain, retrieve the DNS instructions from Vercel (CNAME and A records).
	- Display these instructions in your app for the client.
4.	Validate the Domain
	- Once the client has updated their DNS settings, use the Vercel API to validate the domain and confirm it’s correctly pointing to your app.
5.	Serve Content on the Domain
	- After successful validation, Vercel automatically handles routing requests to your SaaS app.
    - Need a middleware to handle parsing of the domain name and to route the request to the correct tenant.
    - For beginning just serve a static landing page where we display just the domain name and an information that it was setup correctly.

Notes:
- The vercel API is documented here: https://vercel.com/docs/rest-api/endpoints/domains
- At any time, keep in mind the global instructions found in the _features/global-instructions.md file.
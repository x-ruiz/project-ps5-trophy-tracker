# Setup

npm init (first time)

# Setting Runtime Environment Variables

gcloud functions deploy psn-api-function --set-env-vars NPSSO=...

# Deploy functions

cd cloud-functions

gcloud functions deploy psn-api-function \
--gen2 \
--runtime=nodejs22 \
--region=us-central1 \
--source=. \
--entry-point=get \
--trigger-http \

Set allow unauthenticated invocations

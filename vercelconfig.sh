# only deploy main branch
if [[ $VERCEL_GIT_BRANCH != "main" ]]; then exit 1; fi
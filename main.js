const { Octokit } = require('@octokit/rest');

const gitTokens = ['token1']

const gitNames = ['name1']

function generateUniqueName() {
    return `fact_${Math.floor(Math.random() * 150000000)}.txt`;
}

async function pushRandomCatName(repoOwner, token) {
    const octokit = new Octokit({ auth:token });

    try {

        const branchFilesData = await octokit.rest.repos.getContent({
          owner: repoOwner,
          repo: 'randomCatFacts',
          branch: 'main',
        });
    
        console.log(branchFilesData, 'branchFilesData')
    
        const catsResponse = await fetch("https://catfact.ninja/fact");
        const {fact} = await catsResponse.json();
    
        let randomName = generateUniqueName();
    
        const isAlreadyFileNameExist = !!branchFilesData.data.find((user) => {
          return user.path === randomName;
        });
    
        if (isAlreadyFileNameExist) {
          pushRandomCatName(repoOwner, token);
        }

        await octokit.rest.repos.createOrUpdateFileContents({
            owner: repoOwner,
            repo: 'randomCatFacts',
            path: randomName,
            message: 'im dumb',
            content: Buffer.from(fact).toString('base64'),
            branch: 'main'
        });
        console.log('Pushed fact to randomCatFacts');
    } catch (error) {
        console.error('im loh', error);
    }
}


function startExecution() {
    gitTokens.forEach((token, index) => {
        pushRandomCatName(gitNames[index], token);
    })
}

startExecution();

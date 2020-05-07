/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */

module.exports = app => {

  app.on(['pull_request.opened','pull_request.reopened'], async context => {
    const config = (await context.config('auto_pr_team.yml'))

    if (!config) {
      throw new Error('the configuration file failed to load')
    }

    const {
      org,
      team,
    } = config

    const owner = context.payload.pull_request.user.login
    const teamsRequest = await context.github.teams.list({ org: config.org})

    for (const team of teamsRequest.data) {
      if (team.name == config.team) {
        const teamsRequest = await context.github.teams.addOrUpdateMembershipInOrg({
          org: config.org,
          team_slug: team.name,
          username: owner,
        });
        break;
      }
    }
    return
  })
}
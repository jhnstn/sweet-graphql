/*type Query {
  hero(episode: Episode): Character
  human(id: String!): Human
  droid(id: String!): Droid
}*/


/*
hero: {
      type: characterInterface,
      args: {
        episode: {
          description: 'If omitted, returns the hero of the whole saga. If ' +
                       'provided, returns the hero of that particular episode.',
          type: episodeEnum
        }
      },
      resolve: (root, { episode }) => getHero(episode)


*/
/*
var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hero: {
      type: characterInterface,
      args: {
        episode: {
          description: 'If omitted, returns the hero of the whole saga. If ' +
                       'provided, returns the hero of that particular episode.',
          type: episodeEnum
        }
      },
      resolve: (root, { episode }) => getHero(episode),
    },
  */
type Query 'description'
  hero(episode: episodeEnum) :characterType
   (root, {episode}) => { getHero(episode)


  $name(args ...): $type
    $resolve


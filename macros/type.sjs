
macro syntaxToStr {
  rule {$x} => {
    [makeValue(unwrapSyntax($x).toString(), $x)]
  }
}

macro field {

  case { $mName $key $[:] $type! , $description } =>
  {
    'use strict';
    const scalars = ['Int','String', 'Boolean', 'ID'];
    let type = unwrapSyntax(#{$type});
    if(scalars.indexOf(type) !== -1){
      type = 'graphql.GraphQL' + type;
    }
    let fieldType = makeIdent(' new GraphQLNonNull(' + type + ')', #{$mName});
    letstx $gqlType = [fieldType];
    return #{ $key: { $[type]: $gqlType , description: $description}}
  }

  case { $mName $key $[:] $type! } =>
  {
    'use strict';
    const scalars = ['Int','String', 'Boolean', 'ID'];
    let type = unwrapSyntax(#{$type});
    if(scalars.indexOf(type) !== -1){
      type = 'graphql.GraphQL' + type;
    }
    let fieldType = makeIdent(' new GraphQLNonNull(' + type + ')', #{$mName});
    letstx $gqlType = [fieldType];
    return #{ $key: { $[type]: $gqlType }}
  }

  case { $mName $key $[:] [$type], $description } =>
  {
    var fieldType = makeIdent(' new GraphQLList(' + unwrapSyntax(#{$type}) + ')', #{$mName});
    letstx $gqlType = [fieldType];
    return #{$key: {$[type]: $gqlType , description:$description }}
  }

  case { $mName $key $[:] [$type] } =>
  {
    var fieldType = makeIdent(' new GraphQLList(' + unwrapSyntax(#{$type}) + ')', #{$mName});
    letstx $gqlType = [fieldType];
    return #{$key: {$[type]: $gqlType}}
  }

  case { $mName $key $[:] $type , $description } =>
  {
    'use strict'
    const scalars = ['Int','String', 'Boolean', 'ID'];
    let type = unwrapSyntax(#{$type});
    if(scalars.indexOf(type) !== -1){
      type = 'graphql.GraphQL' + type;
    }
    let fieldType = makeIdent(type, #{$mName});
    letstx $fieldType = [fieldType];
    return #{$key: {$[type]: $fieldType , description: $description}}
  }

  case { $mName $key $[:] $type } =>
  {
    'use strict'
    const scalars = ['Int','String', 'Boolean', 'ID'];
    let type = unwrapSyntax(#{$type});
    if(scalars.indexOf(type) !== -1){
      type = 'graphql.GraphQL' + type;
    }
    let fieldType = makeIdent(type, #{$mName});
    letstx $fieldType = [fieldType];
    return #{$key: {$[type]: $fieldType }}
  }
}

macro arg {
  case {_ $args:field , ...} =>
  {
    return #{args}
  }
}

macro query {
  case {_
    $name( $args:field ... ): $objectType
    $resolve:expr
  } => {
    return #{
      $name : {
        $[type]: $objectType,
        $[args] : {
          $args(,)...
        },
        resolve: $resolve
      }
    }
  }

}

macro type {
  case {_
    Query {
      $queries:query ...
    }
  } => {
    return #{
      new graghql.GraphQLObjectType({
        name: 'Query',
        fields: {
          $queries (,) ...
        }
      });
    }
  }
  case {_
    $typeName {
      $fields:field ...
    }
  } => {
    letstx $typeNameStr = syntaxToStr(#{$typeName});
    return #{
      new graghql.GraphQLObjectType({
        name: $typeNameStr,
        fields: {
          $fields (,) ...
        }
      });
    }
  }
}

export type;

var root;
var humanType = type Human {
  id:String!, 'a'
  a:customType!, 'kind'
  b:customType, 'of'
  c:Int, 'blue'
}

var queryType = type Query {
  human(id:Int) :humanType
    (root,{id}) => getHuman(id)

  robot(id:String foo:Int) :robotType
    ({id}) => getRobot(id,name)
}
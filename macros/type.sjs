
macro syntaxToStr {
  rule {$x} => {
    [makeValue(unwrapSyntax($x).toString(), $x)]
  }
}

macro field {
  case { $mName $key $[:] $type! (,) $description } =>
  {
    var fieldType = makeIdent(' new GraphQLNonNull(graphql.GraphQL' + unwrapSyntax(#{$type}) + ')', #{$mName});
    letstx $gqlType = [fieldType];
    letstx $descriptionStr = syntaxToStr($description)
    return #{$key: {$[type]: $gqlType}}
  }

  case { $mName $key $[:] [$type] } =>
  {
    var fieldType = makeIdent(' new GraphQLList(' + unwrapSyntax(#{$type}) + ')', #{$mName});
    letstx $gqlType = [fieldType];
    return #{$key: {$[type]: $gqlType}}
  }

  case { $mName $key $[:] $type } =>
  {
    var fieldType = makeIdent('GraphQL' + unwrapSyntax(#{$type}), #{$mName});
    letstx $gqlType = [fieldType];
    return #{$key: {$[type]: graphql.$gqlType}}
  }
}

macro type {
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

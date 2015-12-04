macro syntaxToStr {
  rule {$x} => {
    [makeValue(unwrapSyntax($x).toString(), $x)]
  }
}
macro enumValue {
  case {_ $enums:ident (,) ... } => {
    var enums = #{$enums ...};
    var out = enums.map((n, idx)=> {
      letstx $idx = [makeValue(idx, #{here})],
             $n = [n]
      return #{$n:$idx ,};
    });
    return out.reduce((acc,o) => acc.concat(o));
  }
}

macro enum {
  case {_
    $typeName , $description {
      $enums:enumValue
    }
  } => {
    letstx $typeNameStr = syntaxToStr(#{$typeName});
    return #{
      new graghql.GraphQLEnumType({
        name: $typeNameStr,
        description : $description,
        values: {
          $enums
        }
      });
    }
  }
  case {_
    $typeName {
      $enums:enumValue
    }
  } => {
    letstx $typeNameStr = syntaxToStr(#{$typeName});
    return #{
      new graghql.GraphQLEnumType({
        name: $typeNameStr,
        values: {
          $enums
        }
      });
    }
  }
}

export enum;
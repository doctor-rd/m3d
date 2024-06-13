import {parse} from 'formeli'

function glsl(tree) {
    let result;
    switch (tree.type) {
        case "add":
            result = "0.";
            for (let i=0; i<tree.adds.length; i++) {
                if (result == "0.")
                    result = "(";
                else
                    result += "+";
                result += glsl(tree.adds[i]);
            }
            if (result != "0.")
                result += ")";
            break;
        case "sub":
            return glsl(tree.lhs) + "-" + glsl(tree.rhs);
        case "mul":
            result = "1.";
            for (let i=0; i<tree.muls.length; i++) {
                if (result == "1.")
                    result = "(";
                else
                    result += "*";
                result += glsl(tree.muls[i]);
            }
            if (result != "1.")
                result += ")";
            break;
        case "div":
            return glsl(tree.lhs) + "/" + glsl(tree.rhs);
        case "pow":
            return "pow(" + glsl(tree.lhs) + "," + glsl(tree.rhs) + ")";
        case "fct":
            let fname = tree.name;
            switch (fname) {
                case "ln":
                    fname = "log";
                    break;
            }
            return fname + "(" + glsl(tree.par) + ")";
        case "var":
            switch (tree.name) {
                case "x":
                case "y":
                    return "p." + tree.name;
                case "t":
                    return tree.name;
                default:
                    return "0.";
            }
        case "num":
            result = "" + tree.value;
            if (tree.value == "pi")
                return "" + Math.PI;
            if (tree.value == "e")
                return "" + Math.E;
            if (result.indexOf(".") < 0)
                return result + ".";
            break;
    }
    return result;
}

export default function glslfunc(expr) {
    const tree = parse(expr);
    return glsl(tree);
}

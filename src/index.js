export default function(babel) {
    return {
        visitor: {
            Identifier(path, state) {
                const name = path.node.name;
                // console.log(state.file.opts.filename + "==> " + name.split("").reverse().join(""));
            },
            FunctionDeclaration(path,state) {
                const filename = state.file.opts.filename.replace(/\\/g,"\\\\");
                if(!filename.includes("node_modules")){
                    console.log(state.file.opts.filename + "==> Enter "+path.node.id.name);
                    // const functionCaller = `console.log("caller: "+new Error().stack.toString().match(/at \w+\.\w+/)[0].split('.')[1]);`;
                    //const functionCaller = `console.log("caller: "+new Error().stack.toString());`;
                   
                    const codeStart = `console.log("${filename} ${path.node.id.name} started.");`;
                    //path.get('body').unshiftContainer('body',babel.parse(functionCaller).program);
                    path.get('body').unshiftContainer('body',babel.parse(codeStart).program);

                    const codeEnd = `console.log("${filename} ${path.node.id.name} ended.");`;
					
					const blockStatement = path.get('body')
					const lastExpression = blockStatement.get('body').pop();
					const timeEndStatement = babel.parse(codeEnd).program;

                    if (lastExpression.type !== 'ReturnStatement') {
						lastExpression.insertAfter(timeEndStatement);
					} else {
						lastExpression.insertBefore(timeEndStatement);
					}	

                    path.skip();

                }
            }
        }
    }
}
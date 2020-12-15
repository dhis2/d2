module.exports = (fileInfo, api) => {
    const j = api.jscodeshift
    const ast = j(fileInfo.source)

    ast.find(j.ImportDeclaration, j.Literal)
        .filter(path => path.node.source.value === 'd2/lib/d2')
        .forEach(path => {
            path.node.source.value = 'd2'
        })

    return ast.toSource({ quote: 'single' })
}

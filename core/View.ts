export class View {

    public initialize(app, path) {

        // Paramétrage du moteur de rendu
        app.set('views', path.join(process.env.BASE, 'views'));
        app.set('view engine', 'ejs');

    }
}

export default new View;
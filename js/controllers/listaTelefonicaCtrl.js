// definindo um controller com $scope *utilizado pelo mesmo*
angular.module("listaTelefonica").controller("listaTelefonicaCtrl", function($scope, contatosAPI, operadorasAPI, serialGenerator) {
	//definindo variável
	$scope.app = "Lista Telefonica";

	// definindo variável
	$scope.contatos = [];

	$scope.operadoras = [];

	var carregarContatos = function () {
		contatosAPI.getContatos().success(function (data) {
			$scope.contatos = data;
		}).error(function (data, status) {
			$scope.message = "Aconteceu um problema: " + data;
		});
	};
	var carregarOperadoras = function () {
		operadorasAPI.getOperadoras().success(function (data) {
			$scope.operadoras = data;
		});
	};

	// definindo função
	$scope.adicionarContato = function(contato) {
		/* Teste se o nome e telefone (ng-model) estão mesmo no $scope
		console.log("Nome: " + $scope.nome + "\nTelefone: " + $scope.telefone); */

		/* Usando
		 $scope.contatos.push({nome: $scope.nome  lendo o scope , telefone: $scope.telefone lendo o scope }); 
		
		Insere os valores no final do array, ver conceitos de arrays em JS para mais.

			Esta é uma forma RUIM de passar parâmetro pois está quebrando um mantra precioso.
			
			--- MANTRA --

			Devemos EVITAR ao máximo ler o $scope estando dentro do controller.
			Isso acaba deixando as coisas menos claras e gera problemas no futuro de testes unitários.
		*/

		/*	Usando	$scope.contatos.push(contato);
		
		O twoway databinding vai te fuder, tu precisa lidar com esse ciclo!!
		
			Abaixo, opções para isso.			 */

		/* uma opção para "desviar" o ciclo do twoway databinding é usar uma função do objeto angular $scope.contatos.push(angular.copy(contato)); */
		
		// mandando um novo contato para o backend
		
		contato.serial = serialGenerator.generate();
		contato.data = new Date();
		contatosAPI.saveContato(contato).success(function (data) {
			delete $scope.contato; 
			$scope.contatoForm.$setPristine(); // voltando a virgindade do formulário
			carregarContatos();
		});

		
		/*	Outra opção para quebrar o ciclo é
		$scope.contatos.push(contato);
		e deletar o objeto contato	*/


	};

	$scope.apagarContatos = function (contatos) {
		$scope.contatos = contatos.filter(function (contato) {
			if (!contato.selecionado) return contato;
		});
	};

	$scope.isContatoSelecionado = function(contatos) {
		return contatos.some(function (contato){
			return contato.selecionado;
		});
	};

	$scope.ordenarPor = function (campo) {
		$scope.criterioDeOrdenacao = campo;
		$scope.direcaoDaOrdenacao = !$scope.direcaoDaOrdenacao;
	}

	carregarContatos();
	carregarOperadoras();
});
window.addEventListener('load',carrega);

function carrega(){
    document.getElementById('field-name').addEventListener('blur', leave);
    document.getElementById('field-num').addEventListener('blur', leave);
    document.getElementById('field-cvv').addEventListener('blur', leave); 
    document.getElementById('field-val').addEventListener('blur', leave);
    document.getElementById('field-cpf').addEventListener('blur', leave);  
}
function leave(){
    if(this.value != ''){
        this.offsetParent.className += " ativo";
    }else{
        this.offsetParent.className = 'box';
    }
}

function inputSHOW(_show){
    if(_show){
        document.getElementById('field-name').offsetParent.className += " ativo";
        document.getElementById('field-num').offsetParent.className += " ativo";
        document.getElementById('field-cvv').offsetParent.className += " ativo";
        document.getElementById('field-val').offsetParent.className += " ativo";
        document.getElementById('field-cpf').offsetParent.className += " ativo";
        document.getElementById('btn-deletar').style.display = 'block';
    }else{
        
        document.getElementById('field-name').offsetParent.className = 'box';
        document.getElementById('field-num').offsetParent.className = 'box';
        document.getElementById('field-cvv').offsetParent.className = 'box';
        document.getElementById('field-val').offsetParent.className = 'box';
        document.getElementById('field-cpf').offsetParent.className = 'box';
        //document.getElementById('btn-deletar').style.display = 'none';
    }
}


function limpaCampo(){
    
    document.getElementById('field-id').value = '';
    document.getElementById('field-name').value = '';
    document.getElementById('field-num').value = '';
    document.getElementById('field-cvv').value = '';
    document.getElementById('field-val').value = '';
    document.getElementById('field-cpf').value = '';
}

//divisa

window.addEventListener('load', carregado);

var db = openDatabase("myDB", "1.0", "TiPS Database Example", 2 * 1024 * 1024);


function carregado(){    
    
    document.getElementById('btn-salvar').addEventListener('click', salvar);
    document.getElementById('btn-deletar').addEventListener('click', deletar);
    
    db.transaction(function(tx) {
        //tx.executeSql("DROP TABLE myTable" );
        tx.executeSql("CREATE TABLE IF NOT EXISTS cartao ( id INTEGER PRIMARY KEY,nome TEXT,numerocartao TEXT,CVV TEXT,validade TEXT,CPF TEXT)" );
//        tx.executeSql('INSERT INTO myTable ( nome,senha,email) VALUES ("a", "b", "c")');
    });
    
    mostrar();
    
}   

function salvar(){
    var id = document.getElementById('field-id').value;
    var nome = document.getElementById('field-name').value;
    var num = document.getElementById('field-num').value;
    var cvv = document.getElementById('field-cvv').value;
    var val = document.getElementById('field-val').value;
    var cpf = document.getElementById('field-cpf').value;

    db.transaction(function(tx) {
        if(id){
            tx.executeSql('UPDATE cartao SET nome=?, numerocartao=?, CVV=?, validade=?, cpf=? WHERE id=?', [nome,num,cvv,val,cpf,id],null);
        }else{
            tx.executeSql('INSERT INTO cartao (nome,numerocartao,CVV,validade,CPF) VALUES (?, ?, ?, ?, ?)', [nome,num,cvv,val,cpf]);
        }
    });

    mostrar();
    limpaCampo();
    inputSHOW(false);
}

function mostrar(){        
    var table = document.getElementById('tbody-register');

    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM cartao', [], function (tx, resultado) {
            var rows = resultado.rows;
            var tr = '';
            for(var i = 0; i < rows.length; i++){
                    tr += '<tr>';
                    tr += '<td class="row" id=' + rows[i].id + '>' + rows[i].nome + '</td>';
                    tr += '<td>' + rows[i].numerocartao + '</td>';
                    tr += '<td>' + rows[i].CVV + '</td>';
                    tr += '<td>' + rows[i].validade + '</td>';
                    tr += '<td>' + rows[i].CPF + '</td>';
                    tr += '</tr>';                   
            }
                table.innerHTML = tr; 
        }, null);
    });
}

alvo = document.getElementById('tbody-register');

alvo.addEventListener('click',function(e){
    if(e.target && e.target.className == 'row'){
        atualizar(e.target.id);
     }
 });

function atualizar(_id){   
    
    var id = document.getElementById('field-id');
    var nome = document.getElementById('field-name');
    var num = document.getElementById('field-num');
    var cvv = document.getElementById('field-cvv');
    var val = document.getElementById('field-val');
    var cpf = document.getElementById('field-cpf');
    
    id.value = _id;
    
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM cartao WHERE id=?', [_id], function (tx, resultado) {
            var rows = resultado.rows[0];

            nome.value = rows.nome ;
            num.value = rows.numerocartao ;
            cvv.value = rows.CVV ;
            val.value = rows.validade ;
            cpf.value = rows.CPF ;
        });
    });
    inputSHOW(true);
}

function deletar(){
    
    var id = document.getElementById('field-id').value;
    
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM cartao WHERE id=?", [id]);
    });
    
    mostrar();
    limpaCampo();
    inputSHOW(false);
}
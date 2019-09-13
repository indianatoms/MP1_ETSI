const Pool = require('pg').Pool
const pool = new Pool({
  user: 'dns',
  host: '127.0.0.1',
  database: 'bind_db',
  password: 'ler30cilrch',
  port: 5432,
})


const deleteDNS = (request, response) => {
  const id = request.params.id;
  console.log("DELETE " + id);

 pool.query('select * from  dns_records where id = $1', [id],(error, results) => {
 	console.log(results.rows)
	if(!results.rows[0]){
		response.status(400).send(`DNS  with ID: ${id} does not exist`);
	}                    
	else{
		
 		 pool.query('delete from projects_dns_records where dns_records_id = $1', [id],(error, results) => {
                        if (error) {
                                throw error
                        }
                        else{
                                pool.query('DELETE FROM dns_records  WHERE id = $1', [id],(error, results) => {
                                        if (error) {
                                                throw error
                                        }
                                        else
                                        {
                                                response.status(200).send(`DNS deleted with ID: ${id}`)
                                        }
                                })
                            }
                	})
		}

	})   
 }

module.exports = {
  deleteDNS
}

const knex = require("../database/knex"); /* importa o knex */

class NotesController {
  async create(request, response) {
    const { title, description, tags, links } = request.body; /* importa informações de dentro do body da requisição feita no Insomnia */
    const { user_id } = request.params; /* importa informações de dentro do params da requisição feita no Insomnia */

    const note_id = await knex("notes").insert({
      title,
      description,
      user_id,
    }); /* insere as informações no banco de dados, na tabela notes */

    const linksInsert = links.map(link => {
      return {
        note_id,
        url: link
      }
    }); 

    await knex("links").insert(linksInsert); /* insere as informações no banco de dados, na tabela links */

    const tagsInsert = tags.map(name => {
      return {
        note_id,
        name, 
        user_id
      }
    });

    await knex("tags").insert(tagsInsert); /* insere as informações no banco de dados, na tabela tags */

    response.json(); /* retorna informações de dentro do response feita no Insomnia */

  }

  async show(request, response) {
    const { id } = request.params; /* pega o ID da nota que foi passado através do request */

    const note = await knex("notes").where({ id }).first();  /* buscar na tabela notas a primeira nota com essa id */
    const tags = await knex("tags").where({ note_id: id }).orderBy("name");  /* buscar na tabela tags uma note_id que é igual a id */
    const links = await knex("links").where({ note_id: id }).orderBy("created_at");  /* buscar na tabela tags uma note_id que é igual a id */

    /* ...note para colocar todos os detalhes da nota aqui */
    return response.json({
      ...note,
      tags,
      links
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("notes").where({ id }).delete(); /* deleta a nota com o id passado através do request */

    return response.json();
  }

  async index(request, response) {
    const { title, user_id, tags } = request.query; /* query é algo dentro do insomnia que eu passo o valor do user_id digitando */

    let notes; /* cria uma variável notes que vou usar no if */

    if(tags) {
      const filterTags = tags.split(',').map(tag => tag.trim()); /* tags.split separa as tags passadas no request através do split */

      notes = await knex("tags").whereIn("name", filterTags).andWhere({ user_id }); /* filtra as tags passadas no request através do whereIn */
    
    } else {

      notes = await knex("notes").where({ user_id }).whereLike("title", `%${title}%`).orderBy("title");

    }

    return response.json({ notes });
  }
}

module.exports = NotesController;
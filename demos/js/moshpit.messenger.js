var Conversation = Backbone.Model.extend({
        defaults: {
                sender_name:'John Doe',
                sender_address:'j.d@email.com',
                messages:[]
            }
    });

var InboxCollection = Backbone.Collection.extend({});

var ThreadList = Backbone.View.extend({
        events:{
            'click li':'_clicked'    
        },
        initialize: function(opts) {
            this.clicked_handler = opts.clicked || false;
        },
        _clicked: function(evnt) {
            // do nadda
            var $clicked = $(evnt.currentTarget);
            if ($clicked.data('thread-index')) {
                if (typeof this.clicked_handler === 'function') {
                    this.clicked_handler(this.collection.at($clicked.data('thread-index')));
                }
            }
        },
        render: function() {
            var html_out = '';
            for (var ci=0,cl=this.collection.length; ci<cl; ci++) {
                var a_thread = this.collection.at(ci);    
                var l_msg = _.last(a_thread.get('messages'));
                var s_name = a_thread.get('sender_name');
                var m_time = l_msg.time;
                var m_body = l_msg.body;

                html_out += '<li data-thread-index="'+ci+'">';
                html_out += '<span>'+s_name+'</span>';
                html_out += '<span>'+m_body+'</span>';
                html_out += '<span>'+(l_msg.direction == 'TO' ? 'sent' : 'recv\'d')+' @ '+m_time+'</span></li>';
            }
            this.$el.empty().html(html_out);
            return this;
        } 
    });

var MessagesDisplay = Backbone.View.extend({
        change_model: function(new_model) {
            if (this.model) {
                this.model.off('change',this.render,this); 
            }
            this.model = new_model;
            this.model.on('change',this.render,this);
            this.render();
            return this;
        },
        render: function() {
            var msgs = this.model.get('messages');
            var html_out = '';
            for (var mi=0,ml=msgs.length; mi<ml; mi++) {
                var a_msg = msgs[mi];
                var name = (a_msg.direction == 'TO') ? 'You' : this.model.get('sender_name'); 

                html_out += '<div class="message-entry';
                html_out += (a_msg.direction == 'TO') ? ' message-to">' : ' message-from">';
                html_out += '<span>'+name+' said :</span>';
                html_out += '<span>'+a_msg.body+'</span>';
                html_out += '<span>'+(a_msg.direction == 'TO' ? 'sent ' : 'recv\'d')+' @ '+a_msg.time+'</span>';
                html_out += '</div>';
            }
            this.$el.empty().html(html_out);
            return this;
        }
    });

var DetailsDisplay = Backbone.View.extend({
        change_model: function(new_model) {
            if (this.model) {
                this.model.off('change',this.render,this); 
            }
            this.model = new_model;
            this.model.on('change',this.render,this);
            this.render();
            return this;
        },
        render: function() {
            var l_msg = _.last(this.model.get('messages'));
            this.$el.find('.sender_detail > .real_name').text(this.model.get('sender_name'));
            this.$el.find('.sender_detail > .sender_address').text(this.model.get('sender_address'));
            this.$el.find('.recv_time').text('last activity @ '+l_msg.time);
        }
    });

(function() {
    var gui = {
        elems:{},
        init: function() {
            this.elems.$message_content = $('#message_content');  
            this.elems.$message_details = $('#message_details');
            this.elems.$threads = $('#threads');

            // backbone views
            this.elems.ThreadList = new ThreadList({
                    el:"#threads_list",
                    collection:data.InboxCollection,
                    clicked:events.change_active
                });

            this.elems.MessagesDisplay = new MessagesDisplay({
                    el:'#message_content_messages'
                });

            this.elems.DetailsDisplay = new DetailsDisplay({
                    el:'#message_details' 
                });

            // Join `MoshPit.js`
            MoshPit.join(this.elems.$message_details);
            MoshPit.join(this.elems.$threads);
            // Default threads and message_details to being shown onload
            MoshPit.show('threads,message_details');

            events.change_active(data.InboxCollection.first());
        }    
    };   
    
    var events = {
        change_active: function(new_model) {
            data.ActiveConversation = new_model; 
            gui.elems.ThreadList.render();
            gui.elems.DetailsDisplay.change_model(data.ActiveConversation);
            gui.elems.MessagesDisplay.change_model(data.ActiveConversation);
        }
    }; 

    var data = {
        init: function() {
            this.InboxCollection = new InboxCollection(); 
            this.ActiveConversation = false;

            // build our dummy data
            for (var i=0; i<30; i++) {
                var convo = {
                    sender_name: 'Mr. Sender the '+i,
                    sender_address: 'mr.sender.'+i+'@email.com',
                    messages:[]
                };
                var the_hour = Math.round(Math.random()*11);
                    if (the_hour <= 0) {
                        the_hour = 1;    
                    }
                for (var j=0; j<30; j++) {
                    var direction = (Math.round(Math.random()*100) > 50) ? 'TO' : 'FROM';
                    var message = (direction == 'TO') ? 'Do you have '+j+' foos?' : 'No, I have '+j+' bars.';
                    var the_min = (j+1 <= 9) ? "0"+String(j+1) : j+1;
                    var the_time = the_hour+":"+the_min+" pm";
                    convo.messages.push({
                            direction:direction,
                            body:message,
                            time: the_time
                        });
                }
                data.InboxCollection.add(new Conversation(convo),{silent:true});    
            }
            data.InboxCollection.trigger('change');
        }
    };

    var init = function() {
        data.init();
        gui.init();    
    };
    $(init);
})();

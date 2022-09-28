class Rules:
    def __init__(self, rules):
        self.rules = {}

        if rules is not None:
            # TODO: Check if default_relations are necessary for current requirements
            self.default_relations = rules['default']['relations'] if rules['default']['relations'] else []
            for rule in rules['rules']:
                self.rules[(rule['head'], rule['tail'])] = rule['relations']

    def is_valid_triple(self, head: str, tail: str, relation: str):
        if not self.rules:
            return True
        
        valid_relations = self.rules.get((head, tail), self.default_relations)
        return relation in valid_relations
